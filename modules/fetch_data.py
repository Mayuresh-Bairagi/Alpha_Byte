import requests
from io import BytesIO
import PyPDF2
from bs4 import BeautifulSoup
from Bio import Entrez

class PMCResearchFetcher:
    def __init__(self):
        """Initialize the fetcher with a preset email for NCBI Entrez."""
        self.email = "mayureshbairagi2@gmail.com"  # Default email
        Entrez.email = self.email

    def fetch_and_parse(self, url):
        """Fetch a URL and return its BeautifulSoup-parsed content."""
        try:
            headers = {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/98.0.4758.102 Safari/537.36"
                )
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            return soup
        except requests.exceptions.RequestException as e:
            print(f"Error fetching URL {url}: {e}")
            return None

    def download_pdf_and_extract_text(self, pdf_url):
        """Download a PDF file from pdf_url and extract its text using PyPDF2."""
        headers = {
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/90.0.4430.93 Safari/537.36'
            )
        }
        response = requests.get(pdf_url, headers=headers)
        if response.status_code == 200:
            pdf_in_memory = BytesIO(response.content)
            try:
                pdf_reader = PyPDF2.PdfReader(pdf_in_memory)
            except Exception as e:
                print(f"Error reading PDF from {pdf_url}: {e}")
                return ""
            text = ""
            for page_num, page in enumerate(pdf_reader.pages, start=1):
                page_text = page.extract_text()
                if page_text:
                    text += page_text
                else:
                    print(f"Warning: No text extracted from page {page_num} of PDF.")
            return text
        else:
            print("Failed to download the PDF. Status code:", response.status_code)
            return ""

    def fetch_articles(self, disease, retmax=5):
        """
        Search PMC for research articles related to the given disease.
        Returns a dictionary with the paper title as key and details (PDF URL and extracted text) as value.
        """
        try:
            handle = Entrez.esearch(db="pmc", term=disease, retmax=retmax)
            record = Entrez.read(handle)
        except Exception as e:
            print("Error during Entrez search:", e)
            return {}
        
        pmc_list = record.get("IdList", [])
        if not pmc_list:
            print("No research articles found for the disease.")
            return {}
        
        articles_dict = {}
        
        for pmc_id in pmc_list:
            article_url = f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{pmc_id}/"
            print(f"\nProcessing article: {article_url}")
            soup = self.fetch_and_parse(article_url)
            if not soup:
                print(f"Skipping article PMC{pmc_id} due to fetch error.")
                continue
                
            # Use the page title as the research paper name
            title_tag = soup.find('title')
            title_text = title_tag.get_text().strip() if title_tag else f"PMC{pmc_id}"
            
            # Find the PDF link (looking for an <a> tag with a specific class)
            pdf_anchor = soup.find('a', class_='usa-button usa-button--outline width-24 display-inline-flex flex-align-center flex-justify-start padding-left-1')
            if pdf_anchor:
                pdf_url = pdf_anchor.get('href')
                # If the link is relative, construct the full URL
                if not pdf_url.startswith('http'):
                    pdf_url = article_url + pdf_url
                print(f"PDF link found: {pdf_url}")
                extracted_text = self.download_pdf_and_extract_text(pdf_url)
            else:
                print(f"PDF link not found for article: {article_url}")
                pdf_url = ""
                extracted_text = ""
            
            articles_dict[title_text] = {
                "url": pdf_url,
                "extracted_text": extracted_text
            }
        
        return articles_dict


