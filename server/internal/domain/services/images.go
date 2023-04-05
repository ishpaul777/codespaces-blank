package services

import (
	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type ImageService interface {
	GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error)
}

// imageService is a concrete implementation of ImageService interface
type imageService struct {
	imageRepository repositories.ImageRepository
}

func NewImageService(imageRepository repositories.ImageRepository) ImageService {
	return &imageService{
		imageRepository: imageRepository,
	}
}

func (i *imageService) GenerateImage(model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error) {
	generativeModel := generative_model.New(model)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	images, err := generativeModel.GenerateImage(nOfImages, prompt)
	if err != nil {
		return nil, err
	}
	return images, nil
}
