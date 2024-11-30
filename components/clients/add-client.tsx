"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

interface AddClientProps {
  onClientAdded: (client: any) => void;
}

export const AddClient: React.FC<AddClientProps> = ({ onClientAdded }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [formData, setFormData] = useState<{
    email: string;
    nom: string;
    telephone: string;
    equipements: {
      nom: string;
      description: string;
      quantite: number;
      etat: string;
    }[];
  }>({
    email: "",
    nom: "",
    telephone: "",
    equipements: [],
  });

  const etatOptions = [
    { value: "attribué", label: "Attribué" },
    { value: "en attente de récupération", label: "En attente de récupération" },
    { value: "récupéré", label: "Récupéré" },
    { value: "en stock", label: "En stock" },
    { value: "en attente", label: "En attente" },
  ];

  const addEquipement = () => {
    setFormData({
      ...formData,
      equipements: [
        ...formData.equipements,
        { nom: "", description: "", quantite: 1, etat: "en stock" },
      ],
    });
  };

  const handleEquipementChange = (
    index: number,
    field: keyof typeof formData.equipements[number],
    value: string | number
  ) => {
    const updatedEquipements = [...formData.equipements];
    (updatedEquipements[index][field] as string | number) = value;
    setFormData({ ...formData, equipements: updatedEquipements });
  };

  const removeEquipement = (index: number) => {
    const updatedEquipements = [...formData.equipements];
    updatedEquipements.splice(index, 1);
    setFormData({ ...formData, equipements: updatedEquipements });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost/api/clients",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        const newClient = response.data;
        onClientAdded(newClient);
        setFormData({
          email: "",
          nom: "",
          telephone: "",
          equipements: [],
        });
        onOpenChange();
      } else {
        console.error("Erreur lors de la création du client");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Client
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="xl" // Agrandit le modal
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Client
              </ModalHeader>
              <ModalBody>
                {/* Section Client */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Email"
                    variant="bordered"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    variant="bordered"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                  <Input
                    label="Phone Number"
                    variant="bordered"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </div>

                {/* Section Equipements */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4">Equipements</h4>
                  {formData.equipements.map((equipement, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg shadow-md"
                    >
                      <Input
                        label="Nom"
                        variant="bordered"
                        value={equipement.nom}
                        onChange={(e) =>
                          handleEquipementChange(index, "nom", e.target.value)
                        }
                      />
                      <Input
                        label="Description"
                        variant="bordered"
                        value={equipement.description}
                        onChange={(e) =>
                          handleEquipementChange(index, "description", e.target.value)
                        }
                      />
                      <Input
                        label="Quantité"
                        type="number"
                        variant="bordered"
                        value={equipement.quantite.toString()}
                        onChange={(e) =>
                          handleEquipementChange(
                            index,
                            "quantite",
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                      <div className="w-full">
                        <Select
                          options={etatOptions}
                          defaultValue={etatOptions.find(
                            (opt) => opt.value === equipement.etat
                          )}
                          onChange={(selectedOption: { value: string; label: string } | null) =>
                            handleEquipementChange(
                              index,
                              "etat",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          placeholder="État"
                        />
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={() => removeEquipement(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button onPress={addEquipement} color="secondary" className="mt-4">
                    Add Equipement
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Add Client
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
