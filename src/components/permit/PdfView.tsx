import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { AiOutlineFilePdf } from "react-icons/ai";
import { useAuth } from '../auth/RequireAuth';
import { useQuery } from '@tanstack/react-query';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
export default ({ id }: { id: string }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { resolveAxios } = useAuth();
    const [loaded, setLoaded] = useState(false);
    const getPdf = async (id: string | undefined) => {
        const { data } = await resolveAxios()?.get(`/permits/${id}/pdf`, {responseType: "blob"});
        return data;
    };
    const { data, error, isFetching } = useQuery(["pdf", id], () =>
        getPdf(id)
    );
    if (error) return <div>Request Failed</div>;
    if (isFetching) return <Spinner />;
    return (
        <>
            <IconButton
                aria-label="open"
                onClick={onOpen}
                variant="link"
                icon={<AiOutlineFilePdf />}
                m={4}
            ></IconButton>

            <Modal onClose={onClose} size="full" isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Document file={data} onLoadSuccess={() => setLoaded(true)} onLoadError={console.error}  renderMode="canvas">
                            {loaded && <Page pageNumber={1} />}
                        </Document>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

}
