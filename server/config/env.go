package config

import (
	"fmt"
	"os"
)

type Config struct {
	PublicHost string
	Port       string
	DBUser     string
	DBAddress  string
	DBName     string
}

var Envs = initConfig()

func initConfig() Config {
	return Config{
		PublicHost: getEnv("PUBLIC_HOST", "http://localhost"),
		Port:       getEnv("PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBAddress:  fmt.Sprintf("%s:%s", getEnv("DB_HOST", "127.0.0.1"), getEnv("DB_PORT", "3306")),
		DBName:     getEnv("DB_NAME", "registerdb"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
