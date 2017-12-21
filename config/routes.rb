Rails.application.routes.draw do
  namespace :v1 do
    get "/pages" => "pages#index"
    post "/pages" => "pages#create"
    get "/pages/:id" => "pages#show"

    get "/books/:id" => "books#show"
    post "/books" => "books#create"
  end
end
