all: qft

qft:
	emcc -O3 -std=c++11 -msse -msimd128 -Wall -Werror --bind bindings/QrackBindings.cpp -Icpp/ cpp/*.cpp -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME=Qrack -s ENVIRONMENT="worker" -s TOTAL_MEMORY=128MB -Lcpp/lib -lqrack -o Qrack.js

