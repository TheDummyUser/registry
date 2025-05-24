package utils

import (
	"errors"
	"time"

	"github.com/TheDummyUser/registry/config"
	"github.com/golang-jwt/jwt/v5"
)

type TokenType string

const (
	AccessToken  TokenType = "access"
	RefreshToken TokenType = "refresh"
)

type TokenDetails struct {
	TokenType TokenType
	Token     string
	ExpiresAt time.Time
}

// GenerateTokens creates both access and refresh tokens for a user
func GenerateTokens(userID uint, username string, role string, teamID uint) (accessDetails, refreshDetails *TokenDetails, err error) {
	// Generate Access Token
	accessToken := jwt.New(jwt.SigningMethodHS256)
	accessClaims := accessToken.Claims.(jwt.MapClaims)
	accessClaims["user_id"] = userID
	accessClaims["username"] = username
	accessClaims["type"] = string(AccessToken)
	accessClaims["role"] = role
	accessClaims["team_id"] = teamID
	accessExpiry := time.Now().Add(15 * time.Minute)
	accessClaims["exp"] = accessExpiry.Unix()

	accessTokenString, err := accessToken.SignedString([]byte(config.Config("TOKEN")))
	if err != nil {
		return nil, nil, err
	}

	// Generate Refresh Token
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	refreshClaims := refreshToken.Claims.(jwt.MapClaims)
	refreshClaims["user_id"] = userID
	refreshClaims["username"] = username
	refreshClaims["type"] = string(RefreshToken)
	refreshClaims["role"] = role
	refreshClaims["team_id"] = teamID
	refreshExpiry := time.Now().Add(7 * 24 * time.Hour) // 7 days
	refreshClaims["exp"] = refreshExpiry.Unix()

	refreshTokenString, err := refreshToken.SignedString([]byte(config.Config("TOKEN")))
	if err != nil {
		return nil, nil, err
	}

	accessDetails = &TokenDetails{
		TokenType: AccessToken,
		Token:     accessTokenString,
		ExpiresAt: accessExpiry,
	}

	refreshDetails = &TokenDetails{
		TokenType: RefreshToken,
		Token:     refreshTokenString,
		ExpiresAt: refreshExpiry,
	}

	return accessDetails, refreshDetails, nil
}

// ValidateToken validates an existing token and returns claims if valid
func ValidateToken(tokenString string, tokenType TokenType) (jwt.MapClaims, error) {
	var secret string
	if tokenType == AccessToken {
		secret = config.Config("TOKEN")
	} else {
		secret = config.Config("TOKEN")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Verify the token type matches
		if tokenType != TokenType(claims["type"].(string)) {
			return nil, errors.New("invalid token type")
		}
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
