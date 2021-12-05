# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"

  namespace :api, defaults: { format: :json } do
    resources :categories, only: %i[index create update destroy]
    resources :redirections, only: %i[index create update destroy]
    resources :site_settings, only: %i[create update index]
    resources :articles, only: %i[index create show update destroy]

    post "categories/reorder", to: "categories#reorder"
  end

  get "*path", to: "home#index", via: :all
end
