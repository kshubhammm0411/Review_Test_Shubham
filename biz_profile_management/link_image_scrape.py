from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time
import urllib.request
import uuid


def scrolledMax(driver):
    offsetPrev = driver.execute_script("return document.documentElement.scrollTop")
    driver.execute_script("document.documentElement.scrollTop = document.documentElement.scrollHeight;")
    time.sleep(5)
    offsetNew = driver.execute_script("return document.documentElement.scrollTop")
    return offsetNew==offsetPrev

def image_scraper(url):
    chrome_options = Options()
    #chrome_options.add_argument("--disable-extensions")
    #chrome_options.add_argument("--disable-gpu")
    #chrome_options.add_argument("--no-sandbox") # linux only
    chrome_options.add_argument("--headless")

    driver = webdriver.Chrome('./chromedriver', options=chrome_options)
    actions = ActionChains(driver)

    WebDriverWait(driver.get(url), 30)

    itr = 0
    while(scrolledMax(driver)==False and itr<10):
        itr+=1

    imgs = driver.find_elements(By.XPATH, '//img')

    hrefs = [img.get_attribute("src") for img in imgs]

    hrefs = [i for i in hrefs if i is not None]

    return(str(hrefs))

    for href in hrefs:
        urllib.request.urlretrieve(href, f"link_images/{str(uuid.uuid4())}.jpg")