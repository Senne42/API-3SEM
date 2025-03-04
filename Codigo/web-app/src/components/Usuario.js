import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import Table from "./UsuarioTable";
import UsuarioDelete from "./UsuarioDelete";
import UsuarioEdit from "./UsuarioEdit";
import Modal from "./Modal";
import withAuthorization from "./withAuthorization";
import restAPI from "../apis/restAPI";

const Document = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataEntry, setDataEntry] = useState(null);
  const [pn, setPn] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      const response = await restAPI.get(`/usuarios/`);

      setData(response.data);

      setIsLoading(false);
    };

    getData();
  }, [name, pn]);

  const getData = async () => {
    setIsLoading(true);

    const response = await restAPI.get(`/usuarios/`);

    setData(response.data);

    setIsLoading(false);
  };

  const onSubmit = async (data, oldData) => {
    setIsEditing(false);

    if (data === oldData) {
      return;
    }

    const response = oldData
      ? await restAPI.put(`/usuarios/${oldData.usuarioid}`, data)
      : await restAPI.post("/usuarios/", data);

    console.log(response);

    getData();
  };

  const onDelete = async (data) => {
    setIsDeleting(false);

    if (!data) {
      return;
    }

    const response = await restAPI.delete(`/usuarios/${data.usuarioid}`);

    console.log(response);

    getData();
  };

  const deleteItem = (item) => {
    setDataEntry(item);
    setIsDeleting(true);
  };

  const editItem = (item) => {
    setDataEntry(item);
    setIsEditing(true);
  };

  const renderedEditModal = (
    <Modal
      title={`${dataEntry ? "Editando" : "Criando Novo"} Usuario`}
      isOpen={isEditing}
      setIsOpen={setIsEditing}
    >
      <UsuarioEdit onSubmit={onSubmit} dataEntry={dataEntry} />
    </Modal>
  );

  const renderedDeleteModal = (
    <Modal
      title="Deletando Usuario"
      isOpen={isDeleting}
      setIsOpen={setIsDeleting}
      size="tiny"
      forceChoice={true}
    >
      <UsuarioDelete onSubmit={onDelete} dataEntry={dataEntry} />
    </Modal>
  );

  return (
    <div className="Document">
      {renderedEditModal}
      {renderedDeleteModal}
      <div className="ui one column stackable grid container">
        <div className="column">
          {/* <div className="ui form">
            <h4 className="ui dividing header">Informações do Traço</h4>
            <div className="two fields">
              <div className="field">
                <label>Nome</label>
                <input
                  type="text"
                  name="manualName"
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="field">
                <label>PN</label>
                <input
                  type="text"
                  name="manualPn"
                  placeholder="PN"
                  value={pn}
                  onChange={(e) => {
                    setPn(e.target.value);
                  }}
                />
              </div>
            </div>
          </div> */}
        </div>
        <div className="column">
          <Loader isLoading={isLoading} />
          <Table data={data} onEdit={editItem} onDelete={deleteItem} />
        </div>
      </div>
    </div>
  );
};

const condition = (authUser) => {
  const authUserParsed = JSON.parse(authUser);
  return !!authUser && authUserParsed.usuarionivel === "1";
};

export default withAuthorization(condition)(Document);
