package cmd

import (
	"github.com/factly/tagore-server/config"
	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "tagore-server",
	Short: "Tagore server is a wrapper built on top of openAI's API",
	Long:  `Tagore server currently supports text generation, text completion and creating a summary for text.`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	cobra.CheckErr(rootCmd.Execute())
}

func init() {
	cobra.OnInitialize(config.SetupVars)

}
