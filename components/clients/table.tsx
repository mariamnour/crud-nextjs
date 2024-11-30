"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Button,
  Input,
} from "@nextui-org/react";
import { RenderCell } from "./render-cell";
import axios from "axios";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  equipements: { id: number; quantite: number }[];
}

interface TableWrapperClientProps {
  clients: Client[];
  onClientUpdated: (updatedClient: Client) => void;
  onClientDeleted: (clientId: number) => void;
}

export const TableWrapperClient: React.FC<TableWrapperClientProps> = ({
  clients,
  onClientUpdated,
  onClientDeleted,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
console.log("clients", clients);
  // Gestion de l'édition d'un client
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    onOpen();
  };

  // Gestion de la suppression d'un client
  const handleDeleteClient = async (clientId: number) => {
    try {
      await axios.delete(`http://localhost/api/clients/${clientId}`);
      onClientDeleted(clientId);
    } catch (error) {
      console.error("Erreur lors de la suppression du client", error);
    }
  };

  // Gestion de l'enregistrement des modifications
  const handleSubmit = async () => {
    if (selectedClient) {
      try {
        const response = await axios.put(
          `http://localhost/api/clients/${selectedClient.id}`,
          selectedClient
        );
        onClientUpdated(response.data.data);
        onOpenChange();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du client", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Client table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={clients}>
          {(item) => (
            // Ajoutez une clé unique basée sur l'id du client
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    client={item}
                    columnKey={columnKey as string}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Formulaire de modification */}
      {selectedClient && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>Edit Client</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                value={selectedClient.nom}
                onChange={(e) =>
                  setSelectedClient({ ...selectedClient, nom: e.target.value })
                }
              />
              <Input
                label="Email"
                value={selectedClient.email}
                onChange={(e) =>
                  setSelectedClient({ ...selectedClient, email: e.target.value })
                }
              />
              <Input
                label="Phone"
                value={selectedClient.telephone}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    telephone: e.target.value,
                  })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onOpenChange}>
                Close
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

// Les colonnes du tableau
const columns = [
  { name: "Name", uid: "nom" },
  { name: "Email", uid: "email" },
  { name: "Phone", uid: "telephone" },
  { name: "Type d'équipement", uid: "equipements" }, // Nouvelle colonne
  { name: "Actions", uid: "actions" },
];
