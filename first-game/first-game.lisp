;;;; first-game.lisp
(in-package #:first-game)

;;; Unos parametros básicos para el tamaño de la ventana y los elementos
(defparameter *unit* 16)
(defun units (n) (* *unit* n))
(defparameter *width* 800)
(defparameter *height* 600)


;;; Unas clases para los elementos que interactuan en el juego
(defclass wall (node)
  ((color :initform "gray50")))

(defclass player (node)
  ((lives :initform 1 :accessor player-lives)
   (points :initform 0 :accessor player-points)
   (width :initform (units 2))
   (height :initform (units 2))
   (color :initform "blue")
   (speed :initform 6)
   (heading :initform nil)))

(defclass drop (node)
  ((width :initform (units 1))
   (height :initform (units 1))
   (speed :initform 3)
   (heading :initform (direction-heading :down))))

(defclass parasite (drop)
  ((color :initform "red")))

(defclass fruit (drop)
  ((color :initform "green")))

;;; Unas funciones para controlar al cubo
(defun holding-left-arrow ()
  (or (keyboard-down-p :kp4)
      (keyboard-down-p :left)))

(defun holding-right-arrow ()
  (or (keyboard-down-p :kp6)
      (keyboard-down-p :right)))

(defun find-joystick-direction ()
  (let ((heading (when (left-analog-stick-pressed-p)
                   (left-analog-stick-heading))))
    (when heading
      (if (and (> heading (/ pi 2))
               (< heading (* 3 (/ pi 2))))
          :left
          :right))))

(defun find-direction ()
  (or (when (plusp (number-of-joysticks))
        (find-joystic-direction))
      (cond ((holding-left-arrow) :left)
            ((holding-right-arrow) :right))))

;;; Metodos para mover los drops y el player
(defmethod update ((player player))
  (with-slots (heading speed) player
    (setf heading (find-direction))
    (when heading
      (move player (direction-heading heading) speed))))

(defmethod update ((drop drop))
  (with-slots (heading speed) drop
    (move drop heading speed)))

;;; Metodos para detectar las colisiones
(defmethod collide ((player player) (wall wall))
  (with-slots (heading speed) player
    (setf heading (opposite-direction heading))
    (move player (direction-heading heading) (* speed 2))))

(defmethod collide ((drop drop) (wall wall))
  (destroy drop))

(defmethod collide ((parasite parasite) (player player))
  (with-slots (lives) player
    (destroy parasite)
    (decf lives)))

(defmethod collide ((fruit fruit) (player player))
  (with-slots (points) player
    (destroy fruit)
    (incf points)))

;;; Funciones para crear los muros del juego
(defun make-wall (x y width height)
  (let ((wall (make-instance 'wall)))
    (resize wall width height)
    (move-to wall x y)
    wall))

(defun make-border (width height)
  (let ((bdr-height (- height (units 2))))
   (with-new-buffer
     ;; borde superior
     (insert (make-wall 0 0 width (units 1)))
     ;; borde inferior
     (insert (make-wall 0 (- height (units 1)) width (units 1)))
     ;; borde izquierdo
     (insert (make-wall 0 (units 1) (units 1) bdr-height))
     ;; borde derecho
     (insert (make-wall (- width (units 1)) (units 1) (units 1) bdr-height))
     (current-buffer))))


;; Clases y metodos para crear un escenario de juego
(defclass first-game (buffer)
  ((player :initform (make-instance 'player))
   (background-color :initform "black")
   (width :initform *width*)
   (height :initform *height*)))

(defmethod initialize-instance :after ((first-game first-game) &key)
  (bind-event first-game '(:r :control) 'start-game))

(defmethod start-game ((first-game first-game))
  (with-slots (player) first-game
    (with-buffer first-game
      (setf (player-lives player) 5)
      (insert player)
      (move-to player 30 (- *height* (units 5)))
      (paste-from first-game (make-border *width* *height*)))))

(defmethod end-game ((first-game first-game))
  (with-slots (player) first-game
    (remove-node first-game player)))

(defun first-game ()
  (setf *screen-height* *height*)
  (setf *screen-width* *width*)
  (setf *resizable* t)
  (setf *scale-output-to-window* t)
  (with-session
      (open-project :first-game)
    (let ((first-game (make-instance 'first-game)))
      (switch-to-buffer first-game)
      (start-game first-game))))

;;; Temporizadores para los drops
(defparameter *fruit-clock* (seconds 5))
(defparameter *parasite-clock* (seconds 5))

(defun update-clock (clock)
  (when (plusp (symbol-value clock))
    (decf (symbol-value clock))))

(defun reset-clock (clock time)
  (setf (symbol-value clock) time))

(defun make-drop (type x y)
  (let ((drop (make-instance type)))
    (move-to drop x y)
    drop))

(defun rand-width ()
  (+ (random (- *width* (units 3))) (units 1)))

(defmethod update :after ((first-game first-game))
  (with-slots (player) first-game
    (if (<= (player-lives player) 0)
        (remove-node first-game player)
        (progn (update-clock '*fruit-clock*)
               (update-clock '*parasite-clock*)
               (when (zerop *fruit-clock*)
                 (reset-clock '*fruit-clock* (seconds (+ (random 4) 2)))
                 (insert (make-drop 'fruit (rand-width) (units 2))))
               (when (zerop *parasite-clock*)
                 (reset-clock '*parasite-clock* (seconds (+ (random 4) 4)))
                 (insert (make-drop 'parasite (rand-width) (units 1))))))))

(defmethod draw :after ((first-game first-game))
  (with-slots (player) first-game
    (draw-string (format nil "Puntos: ~d" (player-points player))
                 (units 2) 2)
    (draw-string (format nil "vidas: ~d" (player-lives player))
                 (units 10) 2)
    (when (zerop (player-lives player))
      (draw-string "Game Over" (units 20) 100 :color "white")
      (draw-string (format nil "Puntos: ~d" (player-points player))
                   (units 20) 120 :color "white"))))
