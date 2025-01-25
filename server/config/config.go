// server/config/config.go
package config

import (
	"fmt"
	"os"
)

// Config structure holds the application configuration settings
type Config struct {
	PublicHost string
	Port       string
	DBUser     string
	DBAddress  string
	DBName     string
}

// Envs holds the global configuration for the application
var Envs = initConfig()

// initConfig reads environment variables or falls back to default values
func initConfig() Config {
	return Config{
		PublicHost: getEnv("PUBLIC_HOST", "http://localhost"),
		Port:       getEnv("PORT", "8080"),
		DBUser:     getEnv("DB_USER", "root"),
		DBAddress:  fmt.Sprintf("%s:%s", getEnv("DB_HOST", "127.0.0.1"), getEnv("DB_PORT", "3306")),
		DBName:     getEnv("DB_NAME", "testdb"),
	}
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
