import simpleaudio as sa
import time
import os

def play_wav(file_name, play_duration, repeat_count):
    try:
        if not os.path.exists(file_name):
            print(f"Error: File '{file_name}' not found!")
            return

        wave_obj = sa.WaveObject.from_wave_file(file_name)

        for i in range(repeat_count):
            print(f"Playing '{file_name}' - {i+1}/{repeat_count} times")
            play_obj = wave_obj.play()  
            time.sleep(play_duration)   
            play_obj.stop()            

        print(f"Finished playing '{file_name}' {repeat_count} times.")

    except Exception as e:
        print(f"Error: {e}")

file_name = input("Enter WAV file name (e.g., '1.wav'): ")
play_duration = float(input("Enter play duration (seconds): "))
repeat_count = int(input("Enter number of repeats: "))


play_wav(file_name, play_duration, repeat_count)
