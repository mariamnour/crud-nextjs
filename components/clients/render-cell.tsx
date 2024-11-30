// src/components/client/render-cell.tsx
import React from "react";
import { User, Tooltip, Chip } from "@nextui-org/react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
interface Props {
  client: any;
  columnKey: string;

  onEdit: (client: any) => void;

  onDelete: (clientId: number) => Promise<void>;
}

export const RenderCell = ({ client, columnKey, onEdit, onDelete }: Props) => {
  const cellValue = client[columnKey];
  const [isModalOpen, setModalOpen] = React.useState(false);

  switch (columnKey) {
    case "email":
      return <span>{client.email}</span>;
    case "nom":
      return <span>{client.nom}</span>;
    case "telephone":
      return <span>{client.telephone}</span>;
      case "equipements":

        const handleOpenModal = () => {
          setModalOpen(true);
        };

        const handleCloseModal = () => {
          setModalOpen(false);
        };

        return (
          <>
            {client.historique && client.historique.length > 0 ? (
              client.historique.length > 2 ? (
                <>
                  {/* Affiche les deux premiers équipements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {client.historique.slice(0, 2).map((entry: any) => (
                      <div
                        key={entry.id}
                        className="border rounded-lg p-4 shadow-md bg-white flex flex-col gap-2"
                      >
                        <h3 className="text-sm font-semibold text-gray-800">
                          {entry.equipement.nom}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {entry.equipement.description || "Pas de description"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              entry.equipement.etat === "attribué"
                                ? "bg-green-100 text-green-600"
                                : entry.equipement.etat === "en attente de récupération"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {entry.equipement.etat}
                          </span>
                          <span className="text-xs text-blue-600 font-semibold">
                            Quantité : {entry.quantite}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bouton pour ouvrir le modal */}
                  <button
                    onClick={handleOpenModal}
                    className="text-sm text-blue-500 mt-2"
                  >
                    Voir plus
                  </button>

                  {/* Modal pour afficher tous les équipements */}
                  {isModalOpen && (
                    <Modal isOpen={isModalOpen} onOpenChange={setModalOpen}>
                      <ModalContent>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-4">
                            Équipements de {client.nom}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {client.historique.map((entry: any) => (
                              <div
                                key={entry.id}
                                className="border rounded-lg p-4 shadow-md bg-white flex flex-col gap-2"
                              >
                                <h3 className="text-sm font-semibold text-gray-800">
                                  {entry.equipement.nom}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {entry.equipement.description || "Pas de description"}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span
                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                      entry.equipement.etat === "attribué"
                                        ? "bg-green-100 text-green-600"
                                        : entry.equipement.etat === "en attente de récupération"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {entry.equipement.etat}
                                  </span>
                                  <span className="text-xs text-blue-600 font-semibold">
                                    Quantité : {entry.quantite}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                          <button
                            onClick={handleCloseModal}
                            className="text-sm text-blue-500"
                          >
                            Fermer
                          </button>
                        </div>
                      </ModalContent>
                    </Modal>
                  )}
                </>
              ) : (
                // Affiche tous les équipements si leur nombre est inférieur ou égal à 2
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {client.historique.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-4 shadow-md bg-white flex flex-col gap-2"
                    >
                      <h3 className="text-sm font-semibold text-gray-800">
                        {entry.equipement.nom}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {entry.equipement.description || "Pas de description"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            entry.equipement.etat === "attribué"
                              ? "bg-green-100 text-green-600"
                              : entry.equipement.etat === "en attente de récupération"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {entry.equipement.etat}
                        </span>
                        <span className="text-xs text-blue-600 font-semibold">
                          Quantité : {entry.quantite}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <span className="text-gray-500">Aucun équipement</span>
            )}
          </>
        );
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Details">
              <button
                title="View user"
                onClick={() => console.log("View user", client.id)}
              >
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit user" color="secondary">
              <button title="Edit user" onClick={() => onEdit(client)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Delete user" color="danger">
              <button
                title="Delete user"
                onClick={() => onDelete(client.id)} // Déplacement de l'appel ici
              >
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return null;
  }
};
