# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"

  namespace :api do
    resources :categories, only: %i[index create update destroy]
    resources :redirections, only: %i[index create update destroy]
    resources :site_settings, only: %i[update index]
  end

  get "*path", to: "home#index", via: :all
end
