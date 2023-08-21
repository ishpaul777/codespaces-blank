package pubsub

import (
	"errors"

	"github.com/factly/tagore/server/internal/infrastructure/pubsub/nats"
)

type PubSub interface {
	// Publish publishes a message to a topic
	Publish(topic string, data []byte) error
	// Subscribe subscribes to a topic
	Subscribe(topic string, callback func(data []byte)) error
	// Close closes the connection
	Close()
}

// ErrInvalidPubSubProvider is the error returned when an invalid provider is passed
var ErrInvalidPubSubProvider = errors.New("invalid pubsub provider")

// NewPubSub returns a new instance of PubSub
func NewPubSub(provider string, url string) (PubSub, error) {
	switch provider {
	case "nats":
		client, err := nats.NewPubSubUsingNats(url)
		if err != nil {
			return nil, err
		}

		return client, nil
	default:
		return nil, ErrInvalidPubSubProvider
	}
}
