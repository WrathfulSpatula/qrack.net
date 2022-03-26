all: qft

qft:
	emcc -O3 -std=c++11 -msimd128 -msse -fexceptions -Wall -Werror --bind bindings/QrackBindings.cpp -Icpp/ cpp/*.cpp -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME=Qrack -s ENVIRONMENT="worker" -s TOTAL_MEMORY=128MB -s NO_DISABLE_EXCEPTION_CATCHING -Lcpp/lib -lqrack -o Qrack.js

