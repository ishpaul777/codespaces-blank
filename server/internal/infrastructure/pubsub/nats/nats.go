package nats

import (
	"github.com/nats-io/nats.go"
)

type PubSubUsingNats struct {
	client *nats.Conn
}

func NewPubSubUsingNats(url string) (*PubSubUsingNats, error) {
	client, err := nats.Connect(url)
	if err != nil {
		return nil, err
	}
	return &PubSubUsingNats{
		client: client,
	}, nil
}

func (p *PubSubUsingNats) Publish(topic string, data []byte) error {
	return p.client.Publish(topic, data)
}

func (p *PubSubUsingNats) Subscribe(topic string, callback func(data []byte)) error {
	_, err := p.client.Subscribe(topic, func(msg *nats.Msg) {
		callback(msg.Data)
	})
	return err
}

func (p *PubSubUsingNats) Close() {
	p.client.Close()
}
