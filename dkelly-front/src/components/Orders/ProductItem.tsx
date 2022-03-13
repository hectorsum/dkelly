import { Badge, border, Box, Button, Flex, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useDispatch } from 'react-redux';
import {addProductCart,addQtyProductCart,deleteProductCart, removeQtyProductCart, updateProductCart} from '../../state/action-creators/cart';
import { Product } from '../../state/actions/product';

interface IProduct {
  product: {
    _id: string,
    name: string,
    qty: number,
    price: number,
  }
}
export const ProductItem: React.FC<IProduct> = ({product: {_id,name,qty,price}}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [counter, setCounter] = useState(0)
  const dispatch = useDispatch();  
  const addToCart = (p: Product): void => {
    if(!isSelected){
      dispatch(addProductCart({
        _id,
        name,
        qty:0,
        price
      }))
      setIsSelected(true)
    }else{
      dispatch(deleteProductCart(p._id))
      setIsSelected(false)
    }
  }
  const decreaseQty = (): void => {
    setCounter(() => counter <= 0 ? 0 : counter - 1);
    if (counter > 0) {
      dispatch(removeQtyProductCart(_id));
    }
  }
  const increaseQty = (): void => {
    setCounter(() => counter === qty ? qty : counter + 1)
    dispatch(addQtyProductCart(_id))
  }
  const updateQty = (id: string, qty: number): void => {
    dispatch(updateProductCart(id, qty));
  }
  return (
    <Flex borderBottom={"1px solid #ccc"} 
          justifyContent={"space-between"} 
          borderRadius={5}
          alignItems={"center"} p={3}
          position={"relative"}
          transition={"all 0.2s ease-out"}
          bgColor={(isSelected) ? "green.100" : "transparent"}
          h={"55px"}
          >
      <Flex>
        <Stack minW={"50px"}>
          <Badge variant='subtle' 
                rounded={"full"} 
                width={"auto"}
                colorScheme={(qty < 10) ? "yellow" : "blue"} mr={3}
                display={"flex"} 
                justifyContent={"center"}
                alignItems={"center"}>
            <Text fontSize="sm">{qty}</Text>
          </Badge>
        </Stack>
        <Text onClick={() => addToCart({_id,name,qty,price})}
              _hover={{
                cursor:"pointer",
                textDecoration:"underline",
              }}>
          {name}
        </Text>
      </Flex>
      {
        (isSelected) && 
        <InputGroup
          size="sm"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100px"
          h={"30px"}
        >
          <InputLeftElement>
            <Button
              rounded="full"
              size={'sm'} 
              onClick={() => decreaseQty()}
            >
              <Icon as={FiMinus} h={4} w={4} />
            </Button>
          </InputLeftElement>
          <Input
            type="number"
            min="0"
            // size="sm"
            height="100%"
            textAlign="center"
            fontSize="md"
            fontWeight={"bold"}
            name="product_quantity"
            value={counter}
            isReadOnly
            variant="unstyled"
            onChange={(e) => {
              updateQty(_id, counter)
            }}
          />
          <InputRightElement>
            <Button
              rounded="full"
              size="sm"
              onClick={() => increaseQty()}
            >
              <Icon as={FiPlus} h={4} w={4} />
            </Button>
          </InputRightElement>
        </InputGroup>
      }
    </Flex>
  )
}
