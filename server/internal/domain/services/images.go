package services

import (
	"os"

	"github.com/factly/tagore/server/internal/domain/models"
	"github.com/factly/tagore/server/internal/domain/repositories"
	"github.com/factly/tagore/server/internal/infrastructure/generative_model"
)

type ImageService interface {
	// GenerateImage generates images using the given provider and prompt - text to image
	GenerateImage(provider, model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error)
	// GenerateVariationsOfImage generates variations of the given image using the given provider and prompt - image to image
	GenerateVariationsOfImage(provider, model string, file *os.File, nOfImages int32) ([]models.GeneratedImage, error)
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

func (i *imageService) GenerateImage(provider, model string, nOfImages int32, prompt string) ([]models.GeneratedImage, error) {
	generativeModel := generative_model.NewImageGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	images, err := generativeModel.GenerateImage(model, nOfImages, prompt)
	if err != nil {
		return nil, err
	}
	return images, nil
}

func (i *imageService) GenerateVariationsOfImage(provider, model string, file *os.File, nOfImages int32) ([]models.GeneratedImage, error) {
	generativeModel := generative_model.NewImageGenerativeModel(provider)

	err := generativeModel.LoadConfig()
	if err != nil {
		return nil, err
	}

	images, err := generativeModel.GenerateVariation(model, file, nOfImages)
	if err != nil {
		return nil, err
	}
	return images, nil
}
