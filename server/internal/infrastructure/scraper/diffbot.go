package scraper

import (
	"encoding/json"
	"errors"
	"net/http"
	urlPack "net/url"
	"time"
)

type diffbotScraper struct {
	url   string
	token string
}

func (d *diffbotScraper) Init(api, token string) {
	d.token = token
	d.url = api
}

func (d diffbotScraper) GetDataFromURL(url string) (interface{}, error) {
	client := http.Client{
		Timeout: time.Minute * 10,
	}

	baseURL := d.url + "/v3/analyze"

	params := urlPack.Values{}
	params.Add("url", url)
	params.Add("token", d.token)
	reqURL, err := urlPack.Parse(baseURL)
	if err != nil {
		return nil, err
	}

	reqURL.RawQuery = params.Encode()

	request, err := http.NewRequest(http.MethodGet, reqURL.String(), nil)
	if err != nil {
		return nil, err
	}

	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, errors.New("error in fetching data from url")
	}

	responseBody := make(map[string]interface{})
	err = json.NewDecoder(response.Body).Decode(&responseBody)
	if err != nil {
		return nil, err
	}

	return responseBody, nil
}
