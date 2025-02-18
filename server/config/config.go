package config

import (
	"fmt"
	"os"
	"runtime"
)

type Config struct {
	PublicHost string
	Port       string
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
}

var Envs = initConfig()

func initConfig() Config {
	return Config{
		PublicHost: getEnv("PUBLIC_HOST", "http://localhost"),
		Port:       getEnv("PORT", "8080"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""), // Use the correct password if set
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBName:     getEnv("DB_NAME", "testdb"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func (c Config) GetDSN() string {
	if runtime.GOOS == "windows" {
		// Windows: Use TCP
		return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
	}
	// Linux/NixOS: Use Unix socket
	return fmt.Sprintf("%s@unix(/run/user/1000/devenv-1eb36ad/mysql.sock)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.DBUser, c.DBName)
}
