package config

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"sync"

	"github.com/joho/godotenv"
)

type DbConfig struct {
	PublicHost string
	Port       string
	DBUser     string
	DBPassword string
	DBHost     string
	DBPort     string
	DBName     string
}

var (
	loadEnvOnce sync.Once
	Envs        DbConfig
)

func init() {
	loadEnvOnce.Do(func() {
		currentDir, err := os.Getwd()
		if err != nil {
			fmt.Println("Warning: Could not determine current directory:", err)
		}

		fmt.Println("Current working directory:", currentDir)

		err = godotenv.Load(".env")
		if err != nil {
			fmt.Println("Trying to load .env from current directory...")

			err = godotenv.Load(filepath.Join("..", ".env"))
			if err != nil {
				fmt.Println("Trying to load .env from parent directory...")

				err = godotenv.Load(filepath.Join(currentDir, ".env"))
				if err != nil {
					fmt.Println("Warning: Could not load .env file from any location")
					fmt.Println("Looked in:", currentDir, "and", filepath.Join(currentDir, "..", ".env"))
				} else {
					fmt.Println("Successfully loaded .env file from:", filepath.Join(currentDir, ".env"))
				}
			} else {
				fmt.Println("Successfully loaded .env file from parent directory")
			}
		} else {
			fmt.Println("Successfully loaded .env file from current directory")
		}
	})
	Envs = initConfig()
}

func initConfig() DbConfig {
	return DbConfig{
		PublicHost: getEnv("PUBLIC_HOST", "http://localhost"),
		Port:       getEnv("PORT", "8080"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBName:     getEnv("DB_NAME", "devRegisty"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func Config(key string) string {
	return os.Getenv(key)
}

func (c DbConfig) GetDSN() string {
	var dsn string
	params := "charset=utf8mb4&parseTime=True&loc=Local"

	if runtime.GOOS == "windows" {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?%s",
			c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName, params)
	} else {
		dsn = fmt.Sprintf("%s@unix(/run/user/1000/devenv-1eb36ad/mysql.sock)/%s?%s",
			c.DBUser, c.DBName, params)
	}

	return dsn
}
