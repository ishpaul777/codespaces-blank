package services

import extScraper "github.com/factly/tagore/server/internal/infrastructure/scraper"

type IScraper interface {
	ScrapeURL(url string) (interface{}, error)
}

type scraper struct {
	API   string
	Token string
}

func NewScraperService(api, token string) IScraper {
	return &scraper{
		API:   api,
		Token: token,
	}
}

func (s *scraper) ScrapeURL(url string) (interface{}, error) {
	scraperClient := extScraper.NewExternalScraperService("diffbot", s.API, s.Token)
	return scraperClient.GetDataFromURL(url)
}
