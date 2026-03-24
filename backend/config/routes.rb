Rails.application.routes.draw do
  resources :comments, only: [:index, :create]
end
