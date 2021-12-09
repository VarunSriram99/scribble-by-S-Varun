# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"

  namespace :api, defaults: { format: :json } do # TODO: Good! But generally we also add the version number in api namespace like "api/v1" etc. No need to make this change now. But just pointing it out.
    resources :categories, only: %i[index create update destroy]
    resources :redirections, only: %i[index create update destroy]
    resources :site_settings, only: %i[index create update]
    resources :articles, except: %i[new edit]
    resources :sessions, only: :create
    resources :public, only: %i[index show], param: :slug

    post "categories/reorder", to: "categories#reorder"
  end

  get "*path", to: "home#index", via: :all
end
