import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Text,
    Textarea,
    VStack,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    RadioGroup,
    Radio,
    Stack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { createMessagesAtBothLocations, getMessagesNearLocation } from '../services/messageService';
import { Message } from '../types';
import { enablePersistence } from '../firebase';

type MessagesProps = {
    currentLat: number;
    currentLng: number;
    antipodeLat: number;
    antipodeLng: number;
}

const Messages = ({ currentLat, currentLng, antipodeLat, antipodeLng }: MessagesProps) => {
    const { t, i18n } = useTranslation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [showAntipode, setShowAntipode] = useState('antipode'); // 'antipode' or 'location'

    // Enable persistence when component mounts
    useEffect(() => {
        enablePersistence();
    }, []);

    const loadMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const location = showAntipode === 'antipode'
                ? { lat: antipodeLat, lng: antipodeLng }
                : { lat: currentLat, lng: currentLng };
            console.log('Loading messages for location:', location);
            const messages = await getMessagesNearLocation({
                location,
                radius: 20, // 20km for debugging
                limit: 10
            });
            setMessages(messages);
        } catch (err) {
            setError(t('messages.error.loading'));
            console.error('Error loading messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load messages when location or toggle changes
    useEffect(() => {
        loadMessages();
    }, [currentLat, currentLng, antipodeLat, antipodeLng, showAntipode]);

    const handleLeaveMessage = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            await createMessagesAtBothLocations(
                message.trim(),
                { lat: currentLat, lng: currentLng },
                { lat: antipodeLat, lng: antipodeLng },
                i18n.language
            );

            toast({
                title: t('messages.toast.sent.title'),
                description: t('messages.toast.sent.description'),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setMessage('');
            onClose();
            setTimeout(() => {
                loadMessages();
            }, 1000);
        } catch (err) {
            setError(t('messages.error.sending'));
            console.error('Error sending message:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckForMessages = () => {
        loadMessages();
    };

    return (
        <Box mt={8} p={4} borderTop="1px" borderColor="gray.200">
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="medium">
                    📦 {t('messages.title')}
                </Text>
                <Alert
                    status="info"
                    variant="subtle"
                    borderRadius="md"
                    fontSize="sm"
                >
                    <AlertIcon />
                    <AlertDescription>
                        {t('messages.description')}
                    </AlertDescription>
                </Alert>
                <RadioGroup
                    onChange={setShowAntipode}
                    value={showAntipode}
                    mb={2}
                >
                    <Stack direction="row">
                        <Radio value="location">
                            {t('messages.messagesSeenFromOriginal')}
                            <Text fontSize="xs" color="gray.500">
                                ({currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°)
                            </Text>
                        </Radio>
                        <Radio value="antipode">
                            {t('messages.messagesSeenAtAntipode')}
                            <Text fontSize="xs" color="gray.500">
                                ({antipodeLat.toFixed(4)}°, {antipodeLng.toFixed(4)}°)
                            </Text>
                        </Radio>
                    </Stack>
                </RadioGroup>

                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>{t('messages.error.title')}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <Box textAlign="center" py={4}>
                        <Spinner />
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {messages.length === 0 ? (
                            <Box textAlign="center" py={4}>
                                <Text color="gray.500" mb={4}>
                                    {t('messages.noMessages')}
                                </Text>
                                <VStack spacing={2}>
                                    <Button
                                        colorScheme="blue"
                                        onClick={onOpen}
                                        isLoading={isLoading}
                                        size="lg"
                                        _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                                        transition="all 0.2s"
                                    >
                                        ✍️ {t('messages.leaveMessage')}
                                    </Button>
                                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                        {t('messages.tagline')}
                                    </Text>
                                </VStack>
                            </Box>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <Box 
                                        key={msg.id} 
                                        p={4} 
                                        borderWidth="1px" 
                                        borderRadius="md"
                                        bg={msg.isAntipode ? "blue.50" : "white"}
                                    >
                                        <Text>{msg.content}</Text>
                                        <Text fontSize="xs" color="gray.500" mt={2}>
                                            {new Date(msg.timestamp).toLocaleString()}
                                            {msg.isAntipode && ` • ${t('messages.fromAntipode')}`}
                                        </Text>
                                    </Box>
                                ))}
                                <Box>
                                    <Button
                                        colorScheme="blue"
                                        variant="outline"
                                        mr={4}
                                        onClick={onOpen}
                                        isLoading={isLoading}
                                        _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                                        transition="all 0.2s"
                                    >
                                        ✍️ {t('messages.leaveMessage')}
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        variant="ghost"
                                        onClick={handleCheckForMessages}
                                        isLoading={isLoading}
                                        _hover={{ bg: "blue.50" }}
                                        transition="all 0.2s"
                                    >
                                        {t('messages.checkMessages')}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </VStack>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('messages.modal.title')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Text fontSize="sm" color="gray.600">
                                {t('messages.modal.discoverableAt')}
                                <br />
                                ({antipodeLat.toFixed(4)}°, {antipodeLng.toFixed(4)}°)
                            </Text>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('messages.modal.placeholder')}
                                size="sm"
                                resize="vertical"
                                minH="100px"
                            />
                            <Button
                                colorScheme="blue"
                                onClick={handleLeaveMessage}
                                isDisabled={!message.trim() || isLoading}
                                isLoading={isLoading}
                            >
                                {t('messages.modal.send')}
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Messages;