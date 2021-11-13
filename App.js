import './App.css'
import React from 'react'

import BenchmarkChart from './components/BenchmarkChart.js'

import Qrack from './Qrack.js'
import QrackWASM from './Qrack.wasm'

const qrack = Qrack({
  locateFile: () => {
    return QrackWASM
  }
})

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      benchmarkData: [],
      fullData: []
    }

    this.handleQftDispatch = this.handleQftDispatch.bind(this)
  }

  componentDidMount () {
    this.handleQftDispatch(1, 12)
  }

  handleQftDispatch (length, maxLength) {
    qrack.then((core) => {
      const start = new Date().getTime()
      const mResult = core.qft_u3(length, 0)
      const end = new Date().getTime()

      const nBenchmarkData = this.state.benchmarkData
      nBenchmarkData.push({ method: '', label: length, value: (end - start) })

      this.setState({ benchmarkData: nBenchmarkData })

      if (length < maxLength) {
        this.handleQftDispatch(length + 1, maxLength)
      } else {
        this.setState({ fullData: nBenchmarkData })
      }
    })
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>WebAssembly Qrack with React From Scratch!</h1>
        <h4>QFT (random unitary initialization)</h4>
        <BenchmarkChart data={this.state.fullData} width={1000} height={400} xLabel='Qubits' xType='number' yLabel='Time (ms)' yType='number' />
        <div>
          <p>These benchmarks for <a href='https://github.com/vm6502q/qrack'>vm650q/qrack</a> <b>were just run in your browser!</b></p>
          <p>Qrack can compile for browsers with WebAssembly. In the time it took to load, this page served you a copy of the full Qrack library built for the purpose, ran a quantum Fourier transform, and graphed the timing results!</p>
        </div>
      </div>
    )
  }
}

export default App
