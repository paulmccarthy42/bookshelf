class V1::UsersController < ApplicationController
  def create
    user = User.new(
      name: params[:name],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
    if user.save
      render json: {status: 'User created successfully'}, status: :created
    else
      render json: {errors: user.errors.full_messages}, status: :bad_request
    end
  end

  def check_current
    if current_user
      render json: current_user.as_json
    else
      render json: {errors: "Not logged in"}, status: :unauthorized
    end
  end
end
