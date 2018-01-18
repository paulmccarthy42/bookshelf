Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  namespace :v1 do
    get "/pages" => "pages#index"
    post "/pages" => "pages#create"
    get "pages/read" => "pages#read"
    get "/pages/:id" => "pages#show"

    get "/books/upload" => "books#upload"
    get "/books" => "books#index"
    get "/books/check" => "books#check"
    get "/books/search" => "books#search"
    get "/books/:id/read" => "books#read"
    get "/books/:id/mark/" => "books#bookmark_check"
    patch "/books/:id/mark/:page_number" => "books#bookmark_move"
    get "/books/:id" => "books#show"
    post "/books" => "books#create"

    get "book_shelves/" => "book_shelves#index"
    get "book_shelves/:id" => "book_shelves#show"
    post "/book_shelves" => "book_shelves#create"

    get "current_user" => "users#check_current"
    post "/users" => "users#create"

    get "book_selections/" => "book_selections#index"
    post "/book_selections" => "book_selections#create"

    post "/comments" => "comments#create"

    get "images" => "images#index"
    post "/images" => "images#create"
  end
end
