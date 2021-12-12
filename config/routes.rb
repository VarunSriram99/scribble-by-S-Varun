# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"

  namespace :api, defaults: { format: :json } do
    resources :redirections, only: %i[index create update destroy]
    resources :site_settings, only: %i[index create update]
    resources :articles, except: %i[new edit]
    resources :sessions, only: :create
    resources :public, only: %i[index show], param: :slug
    resources :categories, only: %i[index create update destroy] do
      collection do
        post :reorder
      end
    end
  end

  get "*path", to: "home#index", via: :all
end
