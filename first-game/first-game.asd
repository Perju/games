;;;; first-game.asd

(asdf:defsystem #:first-game
  :description "Describe first-game here"
  :author "Your Name <your.name@example.com>"
  :license  "Specify license here"
  :version "0.0.1"
  :serial t
  :depends-on (#:xelf)
  :components ((:file "package")
               (:file "first-game")))
