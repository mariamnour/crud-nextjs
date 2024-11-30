"use client";

import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapperClient } from "@/components/clients/table";
import { AddClient } from "./add-client";
import axios from "axios";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  equipements: { id: number; quantite: number }[];
}
interface Equipement {
  id: number;
  nom: string;
  description: string;
  quantite_disponible: number;
  etat: string;
  image_path: string | null;
}
interface Historique {
  id: number;
  equipement: Equipement;
  quantite: number;
  type: string;
  created_at: string;
}

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  // Charger les clients depuis l'API au montage
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost/api/clients");
        console.log("API Response:", response.data.data); // Ajoutez ce log
        setClients(response.data.data); // Assurez-vous que la structure de réponse correspond
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };

    fetchClients();
  }, []);

  // Ajouter un client
  const handleClientAdded = (newClient: any) => {
    // Vérifiez si le nouvel élément est encapsulé dans un objet `client`
    const normalizedClient = newClient.client ? newClient.client : newClient;

    // Ajoutez le client normalisé à la liste
    setClients((prevClients) => [...prevClients, normalizedClient]);
  };

  // Mettre à jour un client
  const handleClientUpdated = (updatedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  // Supprimer un client
  const handleClientDeleted = (clientId: number) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Clients</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddClient onClientAdded={handleClientAdded} />
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapperClient
          clients={clients}
          onClientUpdated={handleClientUpdated}
          onClientDeleted={handleClientDeleted}
        />
      </div>
    </div>
  );
};
