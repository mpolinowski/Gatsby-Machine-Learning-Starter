import React from 'react'
import ReactDOM from 'react-dom'
import Model from '../components/model'
import Train from '../components/train'
import Layer from '../components/layer'
import * as tf from '@tensorflow/tfjs'
import mnist from 'mnist'
import mstyles from '../layouts/msite.module.css'
import Canvas from '../components/canvas'

const data = mnist.set(1500, 100)
const train = data.training
const test = data.test

function* mnistTrainDataGenerator() {
  for (let sample of train) {
    const square_sample = tf.tensor1d(sample.input).reshape([28, 28])
    yield {
      x: tf.tensor1d(sample.input).reshape([28, 28, 1]),
      y: sample.output,
    }
  }
}

function* mnistTestDataGenerator() {
  for (let sample of test) {
    const square_sample = tf.tensor1d(sample.input).reshape([28, 28])
    yield {
      x: tf.tensor1d(sample.input).reshape([28, 28, 1]),
      y: sample.output,
    }
  }
}

class MnistModel extends React.Component {
  render() {
    return (
      <Train
        trainData={mnistTrainDataGenerator}
        samples={1500}
        validationData={mnistTestDataGenerator}
        onBatchEnd={this.props.onBatchEnd}
        epochs={5}
        batchSize={64}
        onTrainEnd={this.props.onTrainEnd}
        train={this.props.train}
        display
      >
        <Model
          optimizer={tf.train.sgd(0.15)}
          loss="categoricalCrossentropy"
          metrics={['accuracy']}
        >
          <Layer
            lname="Conv2D"
            inputShape={[28, 28, 1]}
            kernelSize={5}
            filters={8}
            strides={1}
            activation="relu"
            kernelInitializer="VarianceScaling"
          />
          <Layer lname="MaxPooling2D" poolSize={[2, 2]} strides={[2, 2]} />
          <Layer
            lname="Conv2D"
            kernelSize={5}
            filters={16}
            strides={1}
            activation="relu"
            kernelInitializer="VarianceScaling"
          />
          <Layer lname="MaxPooling2D" poolSize={[2, 2]} strides={[2, 2]} />
          <Layer lname="Flatten" />
          <Layer
            lname="Dense"
            units={10}
            kernelInitializer="VarianceScaling"
            activation="softmax"
          />
        </Model>
      </Train>
    )
  }
}

export default class Mnist extends React.Component {
  constructor() {
    super()
    this.state = {
      model: null,
      training: false,
      trained: false,
      predicted: null,
    }
  }

  predict() {
    const testDigits = [1, 3, 4, 5, 8, 9]
    // Randomly selects a test digit, ideally this is drawn from the val
    // set. But it's just random for now.
    const test = tf.stack(
      testDigits.map(digit => {
        return tf.tensor1d(mnist[digit].get()).reshape([28, 28, 1])
      })
    )
    const probTensor = this.state.model.predict(test)
    //probTensor.print()
    const predictedArr = tf.argMax(probTensor, 1).dataSync()
    console.log(predictedArr)
    const probArr = probTensor.dataSync()
    this.setState({
      predicted: testDigits.map((digit, i) => {
        const imgdigit = mnist[digit].get()
        const prddgt = predictedArr[i]
        const imgpred = mnist[prddgt].get()
        return (
          <div key={i}>
            <span className={mstyles.bspant}> Real </span>
            <Canvas width={28} height={28} mnist={mnist} imgdigit={imgdigit} />
            <Canvas width={28} height={28} mnist={mnist} imgdigit={imgpred} />
            <span className={digit == prddgt ? mstyles.bspang : mstyles.bspanr}>
              {'Pred: ' + Math.round(probArr[i * 10 + digit] * 100)}%{' '}
            </span>
          </div>
        )
      }),
    })
  }

  render() {
    return (
      <div className={mstyles.blogcontent}>
        <h2> Tensorflow Mnist Training and Predictions </h2>
        <div className={mstyles.btdiv}>
          <button
            className="special"
            onClick={() => this.setState({ training: !this.state.training })}
          >
            {this.state.training ? 'Pause Training' : 'Start Training'}
          </button>

          {this.state.trained && (
            <button className="special" onClick={() => this.predict()}>
              Predict
            </button>
          )}
        </div>

        <div className={mstyles.prob}>{this.state.predicted}</div>

        <MnistModel
          onTrainEnd={model => this.setState({ model })}
          onBatchEnd={(metrics, model) =>
            this.setState({ model, trained: true })
          }
          train={this.state.training}
        />
      </div>
    )
  }
}
