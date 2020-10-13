class Task
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :description, type: String
  field :completed, type: Mongoid::Boolean
  belongs_to :user
end
