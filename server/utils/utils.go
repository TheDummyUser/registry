package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func ParseJson(r *http.Request, payload interface{}) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}
	return json.NewDecoder(r.Body).Decode(payload)
}
