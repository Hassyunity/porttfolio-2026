class Comment < ApplicationRecord
  validates :name, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { minimum: 3, maximum: 500 }

  # méthode helper pour récupérer les commentaires d'un article
  scope :for_post, ->(post_id) { where(post_id: post_id).order(created_at: :desc) }
end