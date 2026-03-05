from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.users.models.user_model import User, Address
from apps.users.serializers.address_serializers import AddressSerializer
import uuid

class AddressListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = AddressSerializer(user.addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            # Create Address instance
            new_address = Address(
                id=str(uuid.uuid4()),
                street=data['street'],
                city=data['city'],
                state=data['state'],
                zip_code=data['zip_code'],
                country=data['country'],
                phone=data['phone'],
                is_default=data.get('is_default', False)
            )
            
            # If default is true, set others to false
            if new_address.is_default:
                for addr in user.addresses:
                    addr.is_default = False
            
            user.addresses.append(new_address)
            user.save()
            return Response(AddressSerializer(new_address).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, address_id):
        user = request.user
        
        address = None
        for addr in user.addresses:
            if addr.id == address_id:
                address = addr
                break
        
        if not address:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddressSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            data = serializer.validated_data
            
            if data.get('is_default'):
                for addr in user.addresses:
                    if addr.id != address_id:
                        addr.is_default = False
            
            if 'street' in data: address.street = data['street']
            if 'city' in data: address.city = data['city']
            if 'state' in data: address.state = data['state']
            if 'zip_code' in data: address.zip_code = data['zip_code']
            if 'country' in data: address.country = data['country']
            if 'phone' in data: address.phone = data['phone']
            if 'is_default' in data: address.is_default = data['is_default']

            user.save()
            return Response(AddressSerializer(address).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, address_id):
        user = request.user
        
        initial_len = len(user.addresses)
        user.addresses = [addr for addr in user.addresses if addr.id != address_id]
        
        if len(user.addresses) == initial_len:
            return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)
            
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
