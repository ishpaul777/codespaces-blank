package cmd

import (
	"fmt"
	"log"
	"net/http"

	"github.com/factly/tagore-server/actions"
	"github.com/factly/x/loggerx"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Runs the Tagore server",
	Run: func(cmd *cobra.Command, args []string) {
		r := actions.RegisterRoutes()
		loggerx.Info(fmt.Sprintf("Successfully running server on port %s", viper.GetString("PORT")))
		err := http.ListenAndServe(fmt.Sprintf(":%s", viper.GetString("PORT")), r)
		if err != nil {
			log.Fatal(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
