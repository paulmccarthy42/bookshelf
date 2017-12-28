Rails.application.routes.draw do
  namespace :v1 do
    get "/pages" => "pages#index"
    post "/pages" => "pages#create"
    get "pages/read" => "pages#read"
    get "/pages/:id" => "pages#show"

    get "/books" => "books#index"
    get "books/:id/read" => "books#read"
    get "/books/:id" => "books#show"
    post "/books" => "books#create"

    post "/book_selections" => "book_selections#create"

    get "book_shelves/:id" => "book_shelves#show"
  end
end
