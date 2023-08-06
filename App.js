import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import ImageView from 'react-native-image-viewing';
import axios from 'axios';

export default function App() {
  const [searchKeyword, setSearchKeyword] = useState(''); // search keyword
  const [selectedImage, setSelectedImage] = useState(null); // content image
  const [selectedStyleImage, setSelectedStyleImage] = useState(null); // style image
  const [imageUrls, setImageUrls] = useState([]); // result image display
  const [menuMode, setMenuMode] = useState(true); // result image dimensions
  const [workMode, setWorkMode] = useState('matching'); // work mode: matching or style transfer
  const [styleModel, setStyleModel] = useState('universal'); // style selection

  const [progress, setProgress] = useState(0); // progress bar
  const [uploading, setUploading] = useState(false); // progress bar status flag

  // for image viewer and downloader
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // render some random recommendations on launch
  useEffect(() => {
    defaultDisplay();
  }, []);

  const defaultDisplay = async () => {
    // Implement your search functionality here
    const formData = new FormData();
    formData.append('search_text', "noodle");

    setUploading(true); // set uploading flag

    try {
      const response = await axios.post('http://43.134.102.194:8000/mobile_random_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const totalBytes = progressEvent.total;
          const uploadedBytes = progressEvent.loaded;

          let currentProgress = uploadedBytes / totalBytes;
          if (currentProgress > 0.97) {
            currentProgress = 0.97;
          }
          setProgress(currentProgress);
        },
      });
      console.log(response.data);
      setImageUrls(response.data); // set imageUrls state, download images from the web
      // Handle successful upload
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log('Server Error');
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Network Error');
        console.log('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      alert('Failed to upload image. Please try again.');
      // Handle upload error
    }
    setProgress(0); // reset progress bar text
    setUploading(false);
  };

  // search function
  const handleSearch = async () => {
    // Implement your search functionality here
    console.log('Search keyword:', searchKeyword);
    if (searchKeyword === '') {
      alert('Please enter a search keyword!');
    } else {
      const formData = new FormData();
      formData.append('search_text', searchKeyword);

      setUploading(true); // set uploading flag

      try {
        const response = await axios.post('http://43.134.102.194:8000/mobile_recommend_with_text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const totalBytes = progressEvent.total;
            const uploadedBytes = progressEvent.loaded;

            let currentProgress = uploadedBytes / totalBytes;
            if (currentProgress > 0.97) {
              currentProgress = 0.97;
            }
            setProgress(currentProgress);
          },
        });
        console.log(response.data);
        setImageUrls(response.data); // set imageUrls state, download images from the web
        // Handle successful upload
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server Error');
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Network Error');
          console.log('Request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        alert('Failed to upload image. Please try again.');
        // Handle upload error
      }
      setProgress(0); // reset progress bar text
      setUploading(false);
    }
  };

  // content image upload function
  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access the camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  // style image upload function
  const handleStyleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access the camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedStyleImage(result.uri);
    }
  };

  // switch between matching and style transfer mode  
  const handleSwitchWorkMode = (value) => {
    setMenuMode(false);
    setWorkMode(value);
  }

  // back to main menu
  const handleBackToMainMenu = (value) => {
    setMenuMode(true);
  }

  // style selection
  const handleSwitchStyle = (value) => {
    if (styleModel === 'universal') {
      setStyleModel('car');
    } else {
      setStyleModel('universal');
    }
  };

  // image matching
  const handleImageMatching = async () => {
    if (selectedImage === null) {
      alert('Please upload an image!');
    } else {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.replace('file://', ''),
        type: 'image/jpeg',
        name: selectedImage.split('/').pop()
      });

      setUploading(true); // set uploading flag

      try {
        const response = await axios.post('http://43.134.102.194:8000/mobile_recommend', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const totalBytes = progressEvent.total;
            const uploadedBytes = progressEvent.loaded;

            let currentProgress = uploadedBytes / totalBytes;
            if (currentProgress > 0.97) {
              currentProgress = 0.97;
            }
            setProgress(currentProgress);
          },
        });
        console.log(response.data);
        setImageUrls(response.data); // set imageUrls state, download images from the web
        // Handle successful upload
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server Error');
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
          alert(`Server Error\nStatus: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received··
          console.log('Network Error');
          console.log('Request:', error.request);
          alert(`Network Error, please try again\nRequest content: ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          alert(`Something went wrong, please try again\nError message: ${error.message}`);
        }
      }
      setProgress(0); // reset progress bar text
      setUploading(false);
    }
  };

  // transfer default style images
  const handleTransferTemplates = async () => {

    if (selectedImage === null) {
      alert('Please upload an image!');
    } else {
      const formData = new FormData();
      formData.append('model_type', styleModel);
      console.log(styleModel);
      formData.append('image', {
        uri: selectedImage.replace('file://', ''),
        type: 'image/jpeg',
        name: selectedImage.split('/').pop()
      });

      setUploading(true); // set uploading flag

      try {
        const response = await axios.post('http://43.134.102.194:8000/mobile_transfer_styles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const totalBytes = progressEvent.total;
            const uploadedBytes = progressEvent.loaded;

            let currentProgress = uploadedBytes / totalBytes;
            if (currentProgress > 0.97) {
              currentProgress = 0.97;
            }
            setProgress(currentProgress);
          },
        });
        console.log(response.data);
        const new_result = response.data.map((item) => {
          return `data:image/jpeg;base64,${item.replace(/[\r\n]/gm, '')}`
        });
        setImageUrls(new_result); // set imageUrls state, download images from the web
        // Handle successful upload
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server Error');
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
          alert(`Server Error\nStatus: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received··
          console.log('Network Error');
          console.log('Request:', error.request);
          alert(`Network Error, please try again\nRequest content: ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          alert(`Something went wrong, please try again\nError message: ${error.message}`);
        }
      }
      setProgress(0); // reset progress bar text
      setUploading(false);
    }
  }

  // transfer user style images
  const handleTransferUserStyle = async () => {

    if (selectedImage === null || selectedStyleImage === null) {
      alert('Please upload a content image and a style image!');
    } else {
      const formData = new FormData();
      formData.append('model_type', styleModel);
      console.log(styleModel);
      formData.append('content_image', {
        uri: selectedImage.replace('file://', ''),
        type: 'image/jpeg',
        name: selectedImage.split('/').pop()
      });
      formData.append('style_image', {
        uri: selectedStyleImage.replace('file://', ''),
        type: 'image/jpeg',
        name: selectedStyleImage.split('/').pop()
      });

      setUploading(true); // set uploading flag

      try {
        const response = await axios.post('http://43.134.102.194:8000/mobile_transfer_given_style', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const totalBytes = progressEvent.total;
            const uploadedBytes = progressEvent.loaded;
            let currentProgress = uploadedBytes / totalBytes;
            if (currentProgress > 0.97) {
              currentProgress = 0.97;
            }
            setProgress(currentProgress);
          },
        });
        console.log(response.data);
        const new_result = response.data.map((item) => {
          return `data:image/jpeg;base64,${item.replace(/[\r\n]/gm, '')}`
        });
        setImageUrls(new_result); // set imageUrls state, download images from the web
        // Handle successful upload
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log('Server Error');
          console.log('Status:', error.response.status);
          console.log('Data:', error.response.data);
          alert(`Server Error\nStatus: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received··
          console.log('Network Error');
          console.log('Request:', error.request);
          alert(`Network Error, please try again\nRequest content: ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          alert(`Something went wrong, please try again\nError message: ${error.message}`);
        }
      }
      setProgress(0); // reset progress bar text
      setUploading(false);
    }
  }

  // image viewer
  const openImageView = (index) => {
    setActiveIndex(index);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Welcome to our Image Creation System!</Text>
        {!menuMode &&
          <View style={styles.functions}>
            <TouchableOpacity style={styles.mainMenuButton} onPress={handleBackToMainMenu}>
              <Text style={styles.buttonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>}
        {menuMode &&
          <View style={styles.functions}>
            <TouchableOpacity style={styles.matchingButton} onPress={() => handleSwitchWorkMode('matching')}>
              <Text style={styles.buttonText}>Image Matching</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleTransferButton} onPress={() => handleSwitchWorkMode('styleTransfer')}>
              <Text style={styles.buttonText}>Style Transfer</Text>
            </TouchableOpacity>
          </View>
        }
        {workMode === 'matching' && !menuMode &&
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter search keywords"
              value={searchKeyword}
              onChangeText={text => setSearchKeyword(text)}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>}
        {!menuMode && <View style={styles.uploadButtonContainer}>
          <View style={styles.imageUpload}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageSelect}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
          </View>
          {workMode === 'styleTransfer' && !menuMode &&
            <View style={styles.imageUpload}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleStyleImageSelect}>
                <Text style={styles.buttonText}>Upload Style Image</Text>
              </TouchableOpacity>
              {selectedStyleImage && <Image source={{ uri: selectedStyleImage }} style={styles.selectedImage} />}
            </View>}
        </View>}
        {uploading && (
          <Modal transparent={true} animationType="fade" visible={uploading}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <ProgressBar progress={progress} color="blue" />
                <Text style={styles.modalText}>
                  Processing: {Math.floor(progress * 100)}%...
                </Text>
              </View>
            </View>
          </Modal>
        )}
        {!menuMode && <View style={styles.functions}>
          {workMode === 'matching' && !menuMode &&
            <TouchableOpacity style={styles.matchingButton} onPress={handleImageMatching}>
              <Text style={styles.buttonText}>Image Matching</Text>
            </TouchableOpacity>}
          {workMode === 'styleTransfer' && !menuMode &&
            <TouchableOpacity style={styles.styleTransferButton} onPress={handleSwitchStyle}>
              <Text style={styles.buttonText}>Switch style: {styleModel}</Text>
            </TouchableOpacity>}
          {workMode === 'styleTransfer' && !menuMode &&
            <TouchableOpacity style={styles.styleTransferButton} onPress={handleTransferTemplates}>
              <Text style={styles.buttonText}>Transfer templates</Text>
            </TouchableOpacity>}
          {workMode === 'styleTransfer' && !menuMode &&
            <TouchableOpacity style={styles.styleTransferButton} onPress={handleTransferUserStyle}>
              <Text style={styles.buttonText}>Transfer your own</Text>
            </TouchableOpacity>}
        </View>}
        <View style={styles.imageContainer}>
          {imageUrls.map((imageUrl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openImageView(index)}>
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
          <ImageView
            images={imageUrls.map((url) => ({ uri: url }))}
            imageIndex={activeIndex}
            visible={visible}
            onRequestClose={() => setVisible(false)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Styles
const { width } = Dimensions.get('window');
const imageWidth = width * 0.45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    width: width * 0.85,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  searchButton: {
    height: 40,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageUpload: {
    flex: 1,
    alignItems: 'center',
  },
  uploadButton: {
    width: width * 0.45,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  mainMenuButton: {
    width: width * 0.65,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  matchingButton: {
    width: width * 0.65,
    backgroundColor: '#05a184',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  styleTransferButton: {
    width: width * 0.65,
    backgroundColor: '#a881af',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedImage: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 5,
    marginTop: 20,
  },
  functions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});