
import '../css/Components.css'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Input } from "antd"
import axios from 'axios';
import io from 'socket.io-client'

const socket = io('http://localhost:8000');
export default function HomePage() {
  const [hasOpen, setHasOpen] = useState(false);
  const [movieInput, setMovieInput] = useState("");
  const [movies, setMovies] = useState([]);
  
  

   

  const handleOpenModal = () => {
    setHasOpen(true)
    console.log("hasopen")
  }
  const handleCloseModal = () => {
    setHasOpen(false)
  };

  const handleInputChange = (e) => {
    setMovieInput(e.target.value);
  };

  const addCinema=async()=>{
    try {
      const response = await axios.post("https://cinema-bucketlist-nodejs-service.onrender.com/api/v1/add-cinema", { cinema: movieInput });
      setMovies([...movies, response.data]); 
      setMovieInput(""); 
      getCinema();
    } catch (error) {
      console.error("Failed to add movie", error);
    }
  }

const getCinema=async()=>{
  try{
    const response = await axios.get("https://cinema-bucketlist-nodejs-service.onrender.com/api/v1/get-cinema");
    console.log("response------------>",response.data);
    setMovies(response.data)
  }
  catch(error){
    console.error("Failed to get movie", error);
  }
  
  
}
useEffect(() => {
  socket.on('updateMovies', data => {
    console.log("Updated movies received:", data);
    setMovies(data);
  });

  getCinema();

  // Clean up the socket connection on component unmount
  return () => {
    socket.off('updateMovies');
  };
}, []);


  return (
    <div className='mainContainer '>
      <div className='headingContainer'>
        <h1 className='mainHeading' >Cinema BucketList</h1>
        <h5 className='secondHeading'>Cinema Bucket List is your ultimate tool for organizing and managing the films you plan to watch in the future</h5>
      </div>
      <div className='buttonContainer'>
        <Button style={{ color: "black" }} onClick={handleOpenModal}>Open Added Films in Bucket List</Button>

      </div>
      <Modal
        title="Your Cinema Bucket List"
        visible={hasOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Close
          </Button>,

        ]}
      >
        {movies.map((movie)=>(
          <ul>
            <li>{movie[1]}</li>
          </ul>
        ))}
        <Input
          placeholder="Add a new movie"
          value={movieInput}
          onChange={handleInputChange}
        />
        <Button
          type="primary"
          style={{ marginTop: '10px' }}
          onClick={addCinema}
        >
          Add Movie
        </Button>
      </Modal>
    </div>

  )
}





