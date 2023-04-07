import React, { useState, useEffect, Fragment } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CRUD = () => {
  const empdata = [
    {
      id: 1,
      name: "Manoj",
      age: 29,
      isActive: 1,
    },
    {
      id: 2,
      name: "Rakesh",
      age: 23,
      isActive: 0,
    },
    {
      id: 3,
      name: "Chetan",
      age: 21,
      isActive: 1,
    },
    {
      id: 4,
      name: "Ajay",
      age: 21,
      isActive: 1,
    },
    {
      id: 5,
      name: "Nagsen",
      age: 25,
      isActive: 0,
    },
  ];
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState(0);
  const [editIsActive, setEditIsActive] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        "http://192.180.0.192:9876/api/v1/users/get?OrderBy=Id&SortOrder=1&RecordsPerPage=100&PageNumber=0"
      )
      .then((result) => {
        setData(result.data.data);
        console.log(result.data.data);
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    //alert(id);
    handleShow();
    axios
      .get(`http://192.180.0.192:9876/api/v1/users/getYourself?userId=${id}`)
      .then((result) => {
        setEditId(id);
        setEditName(result.data.data.name);
        setEditAge(result.data.data.age);
        setEditIsActive(result.data.data.isActive);
      });
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure You want to delete?") === true) {
      axios
        .delete(`http://192.180.0.192:9876/api/v1/user/delete?id=${id}`)
        .then((result) => {
          if (result.status == 200) {
            toast.success("Employee has been deleted");
            getData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleUpdate = () => {
    const url = `http://192.180.0.192:9876/api/v1/users/update?id=${editId}`;
    const data = {
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };
    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success("Employee has been updated.");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = () => {
    const url = "http://192.180.0.192:9876/api/v1/user/register";
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };
    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        toast.success("Employee has been added.");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clear = () => {
    setName("");
    setEditName("");
    setAge(0);
    setEditAge(0);
    setIsActive(true);
    setEditIsActive(false);
    setEditId("");
  };
  //modal popup handlers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <ToastContainer />
      <Container>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === true ? true : false}
              value={isActive}
              onClick={(e) => setIsActive(e.target.checked ? true : false)}
            />
            <label>IsActive</label>
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={handleSave}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive == true ? "True" : "False"}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading...."}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              {/* <Col>
                    <input type="text" className="form-control" placeholder="Enter Id"
                    value={editName} onChange={(e)=> setEditName(e.target.value)}/>
                </Col> */}
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Age"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="checkbox"
                  checked={editIsActive === true ? true : false}
                  value={editIsActive}
                  onChange={(e) =>
                    setEditIsActive(e.target.checked ? true : false)
                  }
                />
                <label>IsActive</label>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
export default CRUD;
