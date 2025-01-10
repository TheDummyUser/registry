package user

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/TheDummyUser/server/types"
	"github.com/gorilla/mux"
)

func TestUserServiceHandlers(t *testing.T) {
	userStore := &mockUserStore{}

	handler := NewHandler(userStore)

	tests := []struct {
		name           string
		payload        types.RegisterUserPayload
		expectedStatus int
		expectedError  bool
	}{
		{
			name: "Should fail with empty email",
			payload: types.RegisterUserPayload{
				FirstName: "user",
				LastName:  "123",
				Email:     "", // Empty email should fail
				Password:  "1234",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "Should fail with empty password",
			payload: types.RegisterUserPayload{
				FirstName: "user",
				LastName:  "123",
				Email:     "test@example.com",
				Password:  "", // Empty password should fail
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "Should succeed with valid payload",
			payload: types.RegisterUserPayload{
				FirstName: "user",
				LastName:  "123",
				Email:     "test@example.com",
				Password:  "1234",
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			marshalled, err := json.Marshal(tt.payload)
			if err != nil {
				t.Fatal(err)
			}

			req, err := http.NewRequest(http.MethodPost, "/register", bytes.NewReader(marshalled))
			if err != nil {
				t.Fatal(err)
			}

			rr := httptest.NewRecorder()
			router := mux.NewRouter()
			router.HandleFunc("/register", handler.handleRegister)
			router.ServeHTTP(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("expected status code %d, got %d", tt.expectedStatus, rr.Code)
			}

			if tt.expectedError {
				var response map[string]string
				if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
					t.Fatalf("Failed to decode response body: %v", err)
				}
				if response["error"] == "" {
					t.Error("expected error message in response, got none")
				}
			}
		})
	}
}

type mockUserStore struct {
	users map[string]*types.User
}

func (m *mockUserStore) GetUserByEmail(email string) (*types.User, error) {
	if email == "" {
		return nil, errors.New("email cannot be empty")
	}
	if user, exists := m.users[email]; exists {
		return user, nil
	}
	return nil, errors.New("user not found")
}

func (m *mockUserStore) CreateUser(user types.User) error {
	if user.Email == "" {
		return errors.New("email cannot be empty")
	}
	if user.Password == "" {
		return errors.New("password cannot be empty")
	}
	return nil
}
