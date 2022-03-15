import { Input, InputGroup, Avatar, Button, Flex, FormControl, FormLabel, Icon, Text, Textarea, InputRightElement,InputLeftElement, Box, Spacer, IconButton, Switch } from '@chakra-ui/react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import React, { FC, LegacyRef, useEffect, useMemo, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { ArrowDownIcon, ArrowUpDownIcon, PhoneIcon, SearchIcon } from '@chakra-ui/icons'
import { Product, ProductState } from '../../state/actions/product'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../state'
import { ProductItem } from './ProductItem'
import { getProducts } from '../../state/action-creators/products'
import { removeAllProducts } from '../../state/action-creators/cart'
import { CartState } from '../../state/actions/cart'
import {addOrder} from '../../state/action-creators/order'
import { getCustomers, getSingleCustomer } from '../../state/action-creators/customer'
import { Customer, CustomerState } from '../../state/actions/customer'
import { CustomerItem } from './CustomerItem'
import { SelectedProduct } from './SelectedProduct'

interface IProps {
  initialRef: LegacyRef<HTMLInputElement>,
  finalRef: React.RefObject<HTMLHeadingElement>,
  isOpen: boolean,
  onClose: () => void,
}
export const AddOrder: FC<IProps> = ({initialRef, finalRef, isOpen, onClose}) => {
  const [isActive, setIsActive] = useState(false);
  const [isInputChanging, setIsInputChanging] = useState(false);
  const {products}: ProductState = useSelector((state: RootState) => state.products);
  const {customer: customerSelected,customers}: CustomerState = useSelector((state: RootState) => state.customers);
  const {cart}: CartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    customerid:"",
    customer: "",
    product: "",
    products: [],
    notes: "",
  })
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
  const saveOrder = () => {
    dispatch(addOrder({
      customer: formData.customerid,
      products: cart,
      notes: formData.notes,
      hasPaid: hasPaid
    }));
    onClose();
  }
  console.log("haspaid: ",formData.notes)
  const filteredProducts = useMemo(() => 
  products.filter((p: Product) => (typeof p.name === 'string' && formData.product && p.qty > 0) && p.name.toLowerCase().includes(formData.product.toLowerCase())),
  [products, formData.product]);
  
  const filteredCustomers = useMemo(() => 
  customers.filter((c: Customer) => (typeof c.fullname === 'string' && formData.customer) && c.fullname.toLowerCase().includes(formData.customer.toLowerCase())),
  [customers, formData.customer]);
  
  const closeModal = () => {
    dispatch(removeAllProducts())
    onClose()
  }
  const handleOnBlur = (e: React.FocusEvent<HTMLElement, Element>): void => {
    console.log("blur!!!")
    e.stopPropagation();
    const current_target = e.currentTarget;
    
    if(!current_target.contains(e.relatedTarget)){
      setIsActive(false);
    }
  }
  useEffect(() => {
    const retrieveProducts = () => dispatch(getProducts());
    retrieveProducts();
  },[dispatch])
  useEffect(() => {
    const retrieveCustomers = () => dispatch(getCustomers());
    retrieveCustomers();
  },[dispatch])
  useEffect(() => {
    if(customerSelected){
      const {customer, customerid, ...rest} = formData;
      setFormData({
        customer: customerSelected.fullname,
        customerid: customerSelected._id,
        ...rest
      });
    }
  },[customerSelected])

  return (
    <Modal finalFocusRef={finalRef} 
           isOpen={isOpen} 
           onClose={closeModal} 
           motionPreset='slideInBottom' 
           size={'lg'}
           >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Pedido</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4} position={"relative"}>
            <FormLabel>Cliente</FormLabel>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children={<AiOutlineSearch color='gray.300' />}
              />
                <Input
                  type="search"
                  name="customer"
                  placeholder="Buscar por Nombre"
                  onChange={onChange}
                  onClick={() => setIsInputChanging(true)}
                  value={formData.customer}
                  autoComplete='off'
                />
            </InputGroup>
            {
              (isInputChanging && filteredCustomers.length > 0) && <Box 
                            display={"block"}
                            position={"absolute"}
                            zIndex={999}
                            background={"#fff"}
                            w={"100%"}
                            border="1px solid #ccc" mt={2} mb={4}
                            borderBottom={"none"}
                            borderRadius={5}
                            boxShadow={"0 0 0 1px rgba(0,0,0,.1)"}>
              {
              filteredCustomers.map((c: Customer) => (
                <CustomerItem key={c._id} 
                              customer={c} 
                              setIsInputChanging={setIsInputChanging}/>
              ))
              }
              </Box>
            }
          </FormControl>
          <FormControl isRequired mb={4} position="relative">
            <FormLabel>Productos</FormLabel>
            <InputGroup>
              {/* <InputLeftElement
                pointerEvents='none'
                color='gray.300'
                fontSize='1.2em'
                children={<AiOutlineSearch color='gray.300' />}
              /> */}
              <Input 
                type="text"
                name="product"
                placeholder="Buscar Producto"
                onChange={onChange}
                autoComplete='off'
                onClick={() => setIsActive(true)}
                mr={1}
              />
              <IconButton aria-label='Search Product' 
                          icon={<ArrowUpDownIcon />} 
                          onClick={() => setIsActive(!isActive)}/>
            </InputGroup>
            {
              (cart.length > 0) && <Flex flexWrap={"wrap"} mt={2}>
                {
                  cart.map(p => (
                    <SelectedProduct key={p._id} product={p}/>
                  ))
                }
              </Flex>
            }
            {
              (isActive && filteredProducts.length > 0) && <Box 
                                position={"absolute"}
                                display={"block"}
                                w="100%"
                                zIndex={999}
                                bg="#fff"
                                border="1px solid #ccc" mt={2} mb={4}
                                borderBottom={"none"}
                                borderRadius={5}
                                boxShadow={"0 0 0 1px rgba(0,0,0,.1)"}>
                {
                  filteredProducts.map((p: Product) => (
                    <ProductItem key={p._id} product={p}/>
                  ))
                }
              </Box>
            }
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Notas</FormLabel>
            <Textarea onChange={onChange} name={"notes"} value={formData.notes} resize={"none"}/>
          </FormControl>
          <FormControl isRequired>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Spacer/>
              <FormControl display='flex' alignItems='center' width="fit-content">
                <FormLabel htmlFor='email-alerts' mb='0'>
                  ¿Esta cancelado completo?
                </FormLabel>
                <Switch id='email-alerts' size="lg" onChange={(e) => setHasPaid(!hasPaid)} name={"hasPaid"}/>
              </FormControl>
            </Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={closeModal}>
            Cerrar
          </Button>
          <Button colorScheme='blue' onClick={() => saveOrder()}>Guardar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
