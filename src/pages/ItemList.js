import {
  Box,
  Button,
  Modal,
  Rating,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import swal from "sweetalert";

function ItemList() {
  const [itemlist, setItemlist] = useState([]);
  const [AddItemopen, setaddItemOpen] = useState(false);
  const handleAddItemClose = () => setaddItemOpen(false);
  const [itemData, setItemData] = useState({});
  const [id, setId] = useState(30);
  const [itemError, setItemError] = useState();
  const [image, setImage] = useState();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    background: "#3acfd9",
    p: 4,
  };

  const GetItemList = () => {
    fetch("https://dummyjson.com/products", { method: "GET" })
      .then((res) => res.json())
      .then((result) => {
        setItemlist(result.products.slice(0, 10));
      });
  };

  const handleChangeItemValue = (e) => {
    setItemData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const addItem = () => {
    if (handleAddItemFormValidation()) {
      let x = {
        id: id + 1,
        brand: "Golden",
        category: "home-decoration",
        description: itemData?.description,
        price: itemData?.price,
        rating: String(itemData?.rating),
        images: [URL.createObjectURL(image)],
        thumbnail: "https://i.dummyjson.com/data/products/30/thumbnail.jpg",
        title: itemData?.title,
      };
      setItemlist([...itemlist, x]);
      swal({
        title: "Adding",
        text: "Item Added",
        icon: "success",
      });
      setItemData({});
      setaddItemOpen(false);
      setId(id + 1);
    }
  };

  const deleteProduct = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setItemlist(itemlist.filter((i) => i.id !== id));

        swal("Oops! Your Data has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your Data is safe");
      }
    });
  };

  // validation
  const handleAddItemFormValidation = () => {
    let formErrors = {};
    let formIsValid = true;

    if (!itemData?.title) {
      formIsValid = false;
      formErrors["title_error"] = "Title is required";
    }
    if (!itemData?.description) {
      formIsValid = false;
      formErrors["description_error"] = "Description is required";
    }

    if (!itemData?.price) {
      formIsValid = false;
      formErrors["price_error"] = "Price is required";
    }
    if (!itemData?.rating) {
      formIsValid = false;
      formErrors["rating_error"] = "Rating is required";
    } else if (itemData?.rating > 5) {
      formIsValid = false;
      formErrors["rating_error"] = "Proper Rating is required";
    }

    setItemError(formErrors);
    return formIsValid;
  };

  useEffect(() => {
    GetItemList();
  }, []);

  return (
    <div className="container py-5 row d-flex justify-content-start">
      <div className="d-flex align-items-center">
        <h1 className="">PRODUCT LIST</h1>{" "}
        <ControlPointIcon
          onClick={() => {
            setaddItemOpen(true);
          }}
          className="mx-2 delete-icon px-1 py-1"
        />
      </div>

      {itemlist?.map((data, key) => (
        <div className="col-12 col-lg-4 col-md-6 col-sm-12 p-4">
          <div className="card box d-flex flex-column p-5 w-100">
            <div className="head w-100">
              <div align="right">
                <div className="w-100 h-100 p-2">
                  <DeleteIcon
                    className="delete-icon px-2 py-2"
                    sx={{ width: 50, height: 50 }}
                    onClick={() => {
                      deleteProduct(data.id);
                    }}
                  />
                </div>
              </div>

              <h3 className="w-100 mt-4">{data.title.toUpperCase()}</h3>
              <div className="mt-4">
                <img
                  className="product-img"
                  src={data.images[0]}
                  alt="product image"
                />
              </div>
              <p className="mt-4">{data.description}</p>

              <div className="">
                <p style={{ fontWeight: 600 }}>
                  Price : <span style={{ fontWeight: 400 }}>{data.price}$</span>
                </p>
              </div>
              <div className="">
                <Rating
                  name="read-only"
                  size="large"
                  value={data.rating}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* modal for adding */}
      <Modal
        open={AddItemopen}
        onClose={handleAddItemClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{}}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Add Item
          </Typography>
          <div className="mt-2 d-flex flex-column">
            <TextField
              onChange={handleChangeItemValue}
              value={itemData?.title}
              id="title"
              label="Title"
              variant="standard"
              name="title"
            />
            {itemError?.title_error && (
              <Typography
                variant="caption"
                sx={{
                  color: "red",
                }}
              >
                {itemError?.title_error}
              </Typography>
            )}
          </div>
          <div className="mt-2 d-flex flex-column">
            <TextField
              onChange={handleChangeItemValue}
              value={itemData?.description}
              id="description"
              label="Description"
              variant="standard"
              name="description"
            />
            {itemError?.description_error && (
              <Typography
                variant="caption"
                sx={{
                  color: "red",
                }}
              >
                {itemError?.description_error}
              </Typography>
            )}
          </div>
          <div className="mt-2 d-flex flex-column">
            <TextField
              onChange={handleChangeItemValue}
              value={itemData?.price}
              type="number"
              id="price"
              label="Price"
              variant="standard"
              name="price"
            />
            {itemError?.price_error && (
              <Typography
                variant="caption"
                sx={{
                  color: "red",
                }}
              >
                {itemError?.price_error}
              </Typography>
            )}
          </div>
          <div className="mt-2 d-flex flex-column">
            <TextField
              type="number"
              onChange={handleChangeItemValue}
              value={itemData?.rating}
              id="rating"
              label="Rating"
              variant="standard"
              name="rating"
            />
            {itemError?.rating_error && (
              <Typography
                variant="caption"
                sx={{
                  color: "red",
                }}
              >
                {itemError?.rating_error}
              </Typography>
            )}
            <FormHelperText>*Rating should be in between 0-5</FormHelperText>
          </div>
          <div className="mt-2 d-flex flex-column">
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  let filename = e.target.files[0];
                  setImage(filename);
                }
              }}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Button className="mt-4 mx-3" variant="primary" onClick={addItem}>
              Ok
            </Button>
            <Button
              className="mt-4"
              variant="primary"
              onClick={() => {
                setaddItemOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ItemList;
