import "./Table.css";
import React, { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import { Link, useRouteMatch } from "react-router-dom";

const Table = ({ data, onEdit, onDelete }) => {
  const [columnStyle, setColumnStyle] = useState([]);
  const [contextPosition, setContextPosition] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const thead = useRef();
  const tbody = useRef();

  const { url } = useRouteMatch();

  useEffect(() => {
    const onBodyClick = () => {
      setContextPosition({ left: null, top: null });
      setSelectedItem({});
    };

    const onBodyContextMenu = (event) => {
      if (tbody.current && !tbody.current.contains(event.target)) {
        setContextPosition({ left: null, top: null });
        setSelectedItem({});
      }
    };

    document.body.addEventListener("click", onBodyClick);
    document.body.addEventListener("contextmenu", onBodyContextMenu);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
      document.body.removeEventListener("contextmenu", onBodyContextMenu);
    };
  }, []);

  useEffect(() => {
    if (tbody.current.children[0]) {
      const firstRow = tbody.current.children[0];

      var bodyCellsSize = [];
      for (const child of firstRow.children) {
        bodyCellsSize = [...bodyCellsSize, child.clientWidth];
      }

      var headerCellsSize = [];
      for (const child of thead.current.children) {
        headerCellsSize = [...headerCellsSize, child.clientWidth];
      }

      const columnsSize = headerCellsSize.map((cellSize, index) => {
        if (index === 0 || index === headerCellsSize.length - 1) {
          if (index === 0) {
            return bodyCellsSize[index] > cellSize
              ? { minWidth: `${bodyCellsSize[index]}px` }
              : { minWidth: `${cellSize}px` };
          } else {
            return { width: "100%" };
          }
        } else {
          return bodyCellsSize[index] > cellSize
            ? { minWidth: `${bodyCellsSize[index] + 1}px` }
            : { minWidth: `${cellSize + 1}px` };
        }
      });

      setColumnStyle(columnsSize);
    }
  }, [data]);

  const editItem = (event, item) => {
    event.stopPropagation();

    onEdit(item);
  };

  const deleteItem = (event, item) => {
    event.stopPropagation();

    onDelete(item);
  };

  const onContextMenu = (event, item) => {
    event.preventDefault();

    setSelectedItem(item);
    setContextPosition({ left: event.clientX, top: event.clientY });
  };

  const renderContextMenu = () => {
    if (contextPosition.left || contextPosition.top) {
      return (
        <ContextMenu xy={contextPosition}>
          <div className="ui secondary vertical menu">
            <div
              className="ui dropdown item"
              onClick={(e) => editItem(e, selectedItem)}
            >
              Editar Usuario
            </div>
            <div
              className="ui dropdown item"
              onClick={(e) => deleteItem(e, selectedItem)}
            >
              Deletar Usuario
            </div>
          </div>
        </ContextMenu>
      );
    }

    return null;
  };

  var indexSub = 0;
  const rendredTableHead = data.length
    ? Object.keys(data[0]).map((key, index) => {
        if (key === "usuariosenha") {
          indexSub++;
          return;
        }

        const colName = () => {
          switch (key) {
            case "usuarioid":
              return "ID";
            case "usuarionome":
              return "Nome";
            case "usuarionivel":
              return "Nível";
            case "usuarioemail":
              return "Email";
            case "usuarionivel":
              return "Login";
            default:
              return key;
          }
        };

        return (
          <th key={key} style={columnStyle[index - indexSub]}>
            {colName()}
          </th>
        );
      })
    : null;

  const renderedTableBody = data.map((item, rowIndex) => {
    indexSub = 0;
    const renderedTableCells = Object.entries(item).map((value, index) => {
      if (value[0] === "usuariosenha") {
        indexSub++;
        return;
      }

      return (
        <td
          key={value[0]}
          data-label={value[0]}
          style={columnStyle[index - indexSub]}
        >
          {value[1]}
        </td>
      );
    });

    return (
      <tr
        key={rowIndex}
        className={selectedItem === item ? "active" : ""}
        onContextMenu={(e) => onContextMenu(e, item)}
      >
        {renderedTableCells}
      </tr>
    );
  });

  return (
    <div className="Table">
      {renderContextMenu()}
      <table className="ui selectable celled table unstackable">
        <thead>
          <tr ref={thead}>{rendredTableHead}</tr>
        </thead>
        <tbody ref={tbody}>{renderedTableBody}</tbody>
        <tfoot className="full-width">
          <tr>
            <th colSpan={data.length ? Object.keys(data[0]).length : 0}>
              <div
                className="ui right floated small primary labeled icon button"
                onClick={(e) => editItem(e)}
              >
                <i className="plus icon"></i>
                Adicionar Usuario
              </div>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
