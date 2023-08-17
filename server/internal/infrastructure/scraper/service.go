package scraper

type ExternalScraperService interface {
	GetDataFromURL(url string) (interface{}, error)
}

func NewExternalScraperService(provider, api, token string) ExternalScraperService {
	switch provider {
	default:
		d := diffbotScraper{}
		d.Init(api, token)
		return d
	}
}
