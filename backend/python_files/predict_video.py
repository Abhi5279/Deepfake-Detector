import os
import sys
import cv2
import numpy as np
import tensorflow as tf


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "video_model.h5")
MODEL_PATH = os.path.normpath(MODEL_PATH)


try:
    model = tf.keras.models.load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}", file=sys.stderr)
    sys.exit(1)


FRAME_SIZE = (128, 128)  

def preprocess_frame(frame):
    frame = cv2.resize(frame, FRAME_SIZE)
    frame = frame.astype("float32") / 255.0
    frame = np.expand_dims(frame, axis=0)
    return frame


def predict_video(video_path):
    cap = cv2.VideoCapture(video_path)
    predictions = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        processed = preprocess_frame(frame)
        pred = model.predict(processed, verbose=0)[0][0]
        predictions.append(pred)

    cap.release()

    avg_pred = float(np.mean(predictions))
    label = 1 if avg_pred <= 0.5 else 0 
    return label, avg_pred

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)

    video_path = sys.argv[1]
    if not os.path.exists(video_path):
        sys.exit(1)

    label, confidence = predict_video(video_path)
    sys.stdout.write(f"{label}|{confidence}")
