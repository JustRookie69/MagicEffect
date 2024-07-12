import cv2
import os
import json

def extract_frames(video_path, output_folder, frame_rate=60):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    video = cv2.VideoCapture(video_path)
    
    # Get the original frame rate of the video
    original_frame_rate = video.get(cv2.CAP_PROP_FPS)
    
    # Calculate the interval to extract frames based on the desired frame rate
    frame_interval = max(1, int(original_frame_rate / frame_rate))

    success, image = video.read()
    count = 0
    frame_count = 0

    frames_info = []

    while success:
        # Extract frame if it's at the desired interval
        if frame_count % frame_interval == 0:
            frame_path = os.path.join(output_folder, f"frame{count:05d}.png")
            cv2.imwrite(frame_path, image)
            
            # Store frame information in the list
            frames_info.append({
                "frame_number": count,
                "frame_path": frame_path
            })
            
            count += 1

        success, image = video.read()
        frame_count += 1

    video.release()
    
    # Format the frames information as specified
    formatted_frames_info = {"frames": frames_info}

    # Save the frames information to a JSON file
    json_file_path = os.path.join(output_folder, "frames_info.json")
    with open(json_file_path, 'w') as json_file:
        json.dump(formatted_frames_info, json_file, indent=4)

    print(f"Extracted {count} frames to {output_folder}")
    print(f"Frames information saved to {json_file_path}")

# Example usage with raw string
extract_frames('car.mp4', r'C:\projects\apple\frameExtractor\files', frame_rate=60)




# import cv2
# import os
# import json

# def extract_frames(video_path, output_folder, frame_rate=60):
#     # Create the output folder if it doesn't exist
#     if not os.path.exists(output_folder):
#         os.makedirs(output_folder)

#     # Open the video file
#     video = cv2.VideoCapture(video_path)
    
#     # Get the original frame rate of the video
#     original_frame_rate = video.get(cv2.CAP_PROP_FPS)
    
#     # Calculate the interval to extract frames based on the desired frame rate
#     frame_interval = max(1, int(original_frame_rate / frame_rate))

#     success, image = video.read()
#     count = 0
#     frame_count = 0

#     frames_info = []

#     while success:
#         # Extract frame if it's at the desired interval
#         if frame_count % frame_interval == 0:
#             frame_path = os.path.join(output_folder, f"frame{count:05d}.png")
#             cv2.imwrite(frame_path, image)
            
#             # Store frame information in the list
#             frames_info.append({
#                 "frame_number": count,
#                 "frame_path": frame_path
#             })
            
#             count += 1

#         success, image = video.read()
#         frame_count += 1

#     video.release()
    
#     # Save the frames information to a JSON file
#     json_file_path = os.path.join(output_folder, "frames_info.json")
#     with open(json_file_path, 'w') as json_file:
#         json.dump(frames_info, json_file, indent=4)

#     print(f"Extracted {count} frames to {output_folder}")
#     print(f"Frames information saved to {json_file_path}")

# # Example usage with raw string
# extract_frames('car.mp4', r'C:\projects\apple\frameExtractor\files', frame_rate=60)
